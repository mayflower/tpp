<?php

namespace Mayflower\TPPBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Task
 *
 * @ORM\Table()
 * @ORM\Entity()
 */
class Project
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
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="color", type="string", length=20)
     */
    private $color;

    /**
     * @var integer
     *
     * @ORM\Column(name="resourcesPerWeek", type="integer", nullable=true)
     */
    private $resourcesPerWeek;

    /**
     * @var string
     *
     * @ORM\Column(name="begin", type="date")
     */
    private $begin;

    /**
     * @var string
     *
     * @ORM\Column(name="end", type="date")
     */
    private $end;

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
     * Set name
     *
     * @param string $name
     *
     * @return Task
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set color
     *
     * @param string $color
     *
     * @return Task
     */
    public function setColor($color)
    {
        $this->color = $color;

        return $this;
    }

    /**
     * Get color
     *
     * @return string
     */
    public function getColor()
    {
        return $this->color;
    }

    /**
     * Set resources per week
     *
     * @param integer $resourcesPerWeek
     *
     * @return Task
     */
    public function setResourcesPerWeek($resourcesPerWeek)
    {
        $this->resourcesPerWeek = $resourcesPerWeek;

        return $this;
    }

    /**
     * Get resourcesPerWeek
     *
     * @return integer
     */
    public function getResourcesPerWeek()
    {
        return $this->resourcesPerWeek;
    }

    /**
     * Set week
     *
     * @param \DateTime $begin
     *
     * @return Task
     */
    public function setBegin(\DateTime $begin)
    {
        $this->begin = $begin;
        $this->begin->modify('midnight');

        return $this;
    }

    /**
     * Get week
     *
     * @return \DateTime
     */
    public function getBegin()
    {
        return $this->begin;
    }

    /**
     * Set week
     *
     * @param \DateTime $end
     *
     * @return Task
     */
    public function setEnd(\DateTime $end)
    {
        $this->end = $end;
        $this->end->modify('midnight');

        return $this;
    }

    /**
     * Get week
     *
     * @return \DateTime
     */
    public function getEnd()
    {
        return $this->end;
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
            'name' => $this->getName(),
            'begin' => $this->getBegin(),
            'end' => $this->getEnd(),
            'color' => $this->getColor()
        ];
    }
}
