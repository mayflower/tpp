<?php

namespace Mayflower\TPPBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Task
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="Mayflower\TPPBundle\Entity\TaskRepository")
 */
class Task
{

    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255, nullable=true)
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="information", type="text", nullable=true)
     */
    private $information;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="week", type="date")
     */
    private $week;

    /**
     * @var Resource
     *
     * @ORM\ManyToOne(targetEntity="Resource")
     * @ORM\JoinColumn(name="resource_id", referencedColumnName="id")
     */
    private $resource;

    /**
     * @var Resource
     *
     * @ORM\ManyToOne(targetEntity="Project")
     * @ORM\JoinColumn(name="project_id", referencedColumnName="id")
     */
    private $project;


    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     *
     * @return Task
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set information
     *
     * @param string $information
     *
     * @return Task
     */
    public function setInformation($information)
    {
        $this->information = $information;

        return $this;
    }

    /**
     * Get information
     *
     * @return string
     */
    public function getInformation()
    {
        return $this->information;
    }

    /**
     * Set week
     *
     * @param \DateTime $week
     *
     * @return Task
     */
    public function setWeek(\DateTime $week)
    {
        $this->week = $week;
        $this->week->modify('monday this week');

        return $this;
    }

    /**
     * Get week
     *
     * @return \DateTime
     */
    public function getWeek()
    {
        return $this->week;
    }

    /**
     * Set resource
     *
     * @param \Mayflower\TPPBundle\Entity\Resource $resource
     *
     * @return Task
     */
    public function setResource(Resource $resource = null)
    {
        $this->resource = $resource;

        return $this;
    }

    /**
     * Get resource
     *
     * @return \Mayflower\TPPBundle\Entity\Resource
     */
    public function getResource()
    {
        return $this->resource;
    }

    /**
     * Set project
     *
     * @param \Mayflower\TPPBundle\Entity\Project|Project $project
     *
     * @return Task
     */
    public function setProject(Project $project = null)
    {
        $this->project = $project;

        return $this;
    }

    /**
     * Get project
     *
     * @return Project
     */
    public function getProject()
    {
        return $this->project;
    }

    /**
     * Return array for sending as JSON
     *
     * @return array This object suitable for passing to JsonResponse
     */
    public function toArray()
    {
        return [
            'id' => $this->getId(),
            'title' => $this->getTitle(),
            'resourceId' => $this->getResource() != null ?
                $this->getResource()->getId() :
                null,
            'project' => $this->getProject() != null ?
                $this->getProject()->toArray() :
                null,
            'week' => $this->getWeek(),
            'information' => $this->getInformation()
        ];
    }
}
